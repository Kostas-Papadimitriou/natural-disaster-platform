import ssl
from django.core.mail.backends.smtp import EmailBackend as DjangoEmailBackend
from django.utils.functional import cached_property


class LenientSMTPEmailBackend(DjangoEmailBackend):
    @cached_property
    def ssl_context(self):
        context = ssl.create_default_context()

        # ΜΟΝΟ για development / local δοκιμή
        context.verify_flags &= ~ssl.VERIFY_X509_STRICT

        if self.ssl_certfile or self.ssl_keyfile:
            context.load_cert_chain(self.ssl_certfile, self.ssl_keyfile)

        return context